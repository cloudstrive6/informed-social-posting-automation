/**
 * Backblaze B2 archive (S3-compatible API): every produced item — final video, thumbnail, carousel
 * slides, script, captions and QA reports — is kept in the private `informed-lab-media` bucket under
 * `content/<date>/<item-id>/`. GitHub Releases stay the working store for publishing; B2 is the
 * permanent library. Skipped silently when the B2 secrets aren't set.
 */
import { createReadStream, existsSync, readdirSync, statSync } from "node:fs";
import { basename, extname, join } from "node:path";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { env } from "../lib/config.js";
import { log } from "../lib/log.js";

const TYPES: Record<string, string> = {
  ".mp4": "video/mp4", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".json": "application/json",
  ".srt": "application/x-subrip", ".vtt": "text/vtt", ".txt": "text/plain", ".mp3": "audio/mpeg", ".wav": "audio/wav",
};

/** Item-level metadata worth keeping next to the media (intermediate renders are not archived). */
const KEEP = /^(item|script|shots|qa-report|qa-.*|narration)\.json$|\.(srt|vtt|txt)$/i;

let client: S3Client | undefined;
function b2() {
  const keyId = env("B2_KEY_ID"), key = env("B2_APPLICATION_KEY");
  if (!keyId || !key) return undefined;
  const region = env("B2_REGION") ?? "us-west-004";
  client ??= new S3Client({
    region, endpoint: env("B2_ENDPOINT") ?? `https://s3.${region}.backblazeb2.com`,
    credentials: { accessKeyId: keyId, secretAccessKey: key }, forcePathStyle: true,
  });
  return client;
}
export const b2Enabled = () => !!b2();
const bucket = () => env("B2_BUCKET") ?? "informed-lab-media";

export async function uploadToB2(file: string, key: string) {
  const s3 = b2();
  if (!s3) return;
  const upload = new Upload({
    client: s3, queueSize: 4, partSize: 16 * 1024 * 1024, // multipart for long 60fps videos
    params: { Bucket: bucket(), Key: key, Body: createReadStream(file), ContentType: TYPES[extname(file).toLowerCase()] ?? "application/octet-stream" },
  });
  await upload.done();
}

/** Archive one produced item. Never throws: archiving must not block publishing. */
export async function archiveItem(date: string, id: string, itemDir: string): Promise<string | undefined> {
  if (!b2()) return undefined;
  const prefix = `content/${date}/${id}`;
  const files: [string, string][] = [];
  const finalDir = join(itemDir, "final");
  if (existsSync(finalDir)) for (const f of readdirSync(finalDir)) files.push([join(finalDir, f), `${prefix}/${f}`]);
  for (const f of readdirSync(itemDir)) if (KEEP.test(f) && statSync(join(itemDir, f)).isFile()) files.push([join(itemDir, f), `${prefix}/meta/${f}`]);
  let bytes = 0;
  try {
    for (const [file, key] of files) { await uploadToB2(file, key); bytes += statSync(file).size; }
    log.info(`archived ${files.length} files (${(bytes / 1e6).toFixed(1)} MB) → b2://${bucket()}/${prefix}/`);
    return `b2://${bucket()}/${prefix}/`;
  } catch (e) {
    log.warn(`B2 archive of ${id} failed (${(e as Error).message.slice(0, 200)}); media is still in the GitHub release`);
    return undefined;
  }
}

/** For one-off backfills: `tsx src/publish/b2.ts out/2026-09-26` archives every item folder in a day. */
if (process.argv[1] && basename(process.argv[1]) === "b2.ts" && process.argv[2]) {
  const day = process.argv[2];
  for (const id of readdirSync(day)) if (existsSync(join(day, id, "item.json"))) await archiveItem(basename(day), id, join(day, id));
}
