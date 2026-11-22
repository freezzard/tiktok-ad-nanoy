// A working bring-the-humans-03 entry (Node 22, standard library only).
//
// It copies VIDEO.json from the repository root to the output directory,
// where the gate reads it. That is all the program has to do. The entry is
// the video itself: an original short vertical ad, posted publicly on
// TikTok from a public account with the bounty's line and the play code in
// its caption, VIDEO.json naming the video, and the house reading the
// video's views from TikTok. Nothing this program writes about the video
// is scored.
//
// Before copying, it reads VIDEO.json and checks that it parses and that
// its url is a non-empty string, so a malformed handover fails loudly
// here instead of reaching the gate as a silent invalid entry.
//
// The ad shows the brand badge (the mascot mark and the wordmark) from its
// first frame and ends on the referral end card with the account's own
// referral code in its field, both from the press pack and used as they
// are, as is every mark, wordmark or colour in it. Fetch the manifest and
// the guide when making the ad; this repository holds no copy of them.
//
// Outside the grader's container, the two directory variables below stand
// in for /bot and /output; point them at the repository root and at an
// output folder to run the program locally.

import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const videoRelayBotEnvName = 'MAKE' + 'FUN_BOT_DIR';
const videoRelayOutputEnvName = 'MAKE' + 'FUN_OUTPUT_DIR';

const videoRelayBotDir = process.env[videoRelayBotEnvName] ?? '/bot';
const videoRelayOutputDir = process.env[videoRelayOutputEnvName] ?? '/output';

const videoRelaySourcePath = join(videoRelayBotDir, 'VIDEO.json');
const videoRelayTargetPath = join(videoRelayOutputDir, 'VIDEO.json');

if (!existsSync(videoRelaySourcePath)) {
  console.error(`VIDEO.json not found under ${videoRelayBotDir}`);
  process.exit(1);
}

const videoRelayRawText = readFileSync(videoRelaySourcePath, 'utf8');

let videoRelayParsedEntry: unknown;
try {
  videoRelayParsedEntry = JSON.parse(videoRelayRawText) as unknown;
} catch (videoRelayParseFailure) {
  const videoRelayParseDetail = videoRelayParseFailure as Error;
  console.error(`VIDEO.json does not parse: ${videoRelayParseDetail.message}`);
  process.exit(1);
}

const videoRelayEntryShape =
  typeof videoRelayParsedEntry === 'object' &&
  videoRelayParsedEntry !== null &&
  'url' in videoRelayParsedEntry;

if (!videoRelayEntryShape) {
  console.error('VIDEO.json holds no url field');
  process.exit(1);
}

const videoRelayUrlValue = (
  videoRelayParsedEntry as { url: unknown }
).url;

if (typeof videoRelayUrlValue !== 'string' || videoRelayUrlValue.length === 0) {
  console.error('VIDEO.json url is not a non-empty string');
  process.exit(1);
}

mkdirSync(videoRelayOutputDir, { recursive: true });

try {
  copyFileSync(videoRelaySourcePath, videoRelayTargetPath);
} catch (videoRelayCopyFailure) {
  const videoRelayFailureDetail = videoRelayCopyFailure as Error;
  console.error(
    `VIDEO.json could not be copied from ${videoRelayBotDir}: ${videoRelayFailureDetail.message}`,
  );
  process.exit(1);
}
