import fs from "fs";
import { requests } from ".";

// https://twitter.com/scanlime/status/1512598559769702406
// https://github.com/oscie57/tiktok-voice/blob/main/main.py

const voices: string[] = [
  // DISNEY VOICES
  "en_us_ghostface", // Ghost Face
  "en_us_chewbacca", // Chewbacca
  "en_us_c3po", // C3PO
  "en_us_stitch", // Stitch
  "en_us_stormtrooper", // Stormtrooper
  "en_us_rocket", // Rocket

  // ENGLISH VOICES
  "en_au_001", // English AU - Female
  "en_au_002", // English AU - Male
  "en_uk_001", // English UK - Male 1
  "en_uk_003", // English UK - Male 2
  "en_us_001", // English US - Female (Int. 1)
  "en_us_002", // English US - Female (Int. 2)
  "en_us_006", // English US - Male 1
  "en_us_007", // English US - Male 2
  "en_us_009", // English US - Male 3
  "en_us_010", // English US - Male 4

  // EUROPE VOICES
  "fr_001", // French - Male 1
  "fr_002", // French - Male 2
  "de_001", // German - Female
  "de_002", // German - Male
  "es_002", // Spanish - Male

  // AMERICA VOICES
  "es_mx_002", // Spanish MX - Male
  "br_001", // Portuguese BR - Female 1
  "br_003", // Portuguese BR - Female 2
  "br_004", // Portuguese BR - Female 3
  "br_005", // Portuguese BR - Male

  // ASIA VOICES
  "id_001", // Indonesian - Female
  "jp_001", // Japanese - Female 1
  "jp_003", // Japanese - Female 2
  "jp_005", // Japanese - Female 3
  "jp_006", // Japanese - Male
  "kr_002", // Korean - Male 1
  "kr_003", // Korean - Female
  "kr_004", // Korean - Male 2

  // SINGING VOICES
  "en_female_f08_salut_damour", // Alto
  "en_male_m03_lobby", // Tenor
  "en_female_f08_warmy_breeze", // Warmy Breeze
  "en_male_m03_sunshine_soon", // Sunshine Soon

  // OTHER
  "en_male_narration", // narrator
  "en_male_funny", // wacky
  "en_female_emotional", // peaceful
];

/**
 * Connects to the TikTok TTS API and generates an audio file from the given request text.
 *
 * @param {string} req_text - The text to be transformed into speech.
 * @param {string} [session_id="26c41c9e408ce0bb1e9b758e81d774b2"] - The session ID for the TikTok account.
 * @param {string} [text_speaker="en_us_001"] - The code for the desired voice for the text-to-speech synthesis.
 * @returns {Object} - An object containing the status, status code, duration, data, speaker, and log of the request.
 */
export const tts = async (
  req_text: string,
  session_id: string = "26c41c9e408ce0bb1e9b758e81d774b2",
  text_speaker: string = "en_us_001"
) => {
  let ttsText = req_text;
  ttsText = ttsText.replace("+", "plus");
  ttsText = ttsText.replace(" ", "+");
  ttsText = ttsText.replace("&", "and");

  const headers = {
    "User-Agent":
      "com.zhiliaoapp.musically/2022600030 (Linux; U; Android 7.1.2; es_ES; SM-G988N; Build/NRD90M;tt-ok/3.12.13.1)",
    Cookie: `sessionid=${session_id}`,
    "Accept-Encoding": "*",
  };
  const url = `https://api16-normal-useast5.us.tiktokv.com/media/api/text/speech/invoke/?text_speaker=${text_speaker}&req_text=${ttsText}&speaker_map_type=0&aid=1233`;
  const r = await requests.request({ method: "POST", url, headers });

  if (r.body["message"] == "Couldn't load speech. Try again.") {
    const output_data = {
      status: "Session ID is invalid",
      status_code: 500,
      duration: 0,
      data: undefined,
      speaker: undefined,
    };
    return output_data;
  }

  const vstr = r.body["data"]["v_str"];
  const msg = r.body["message"];
  const scode = r.body["status_code"];
  const log = r.body["extra"]["log_id"];

  const dur = r.body["data"]["duration"];
  const spkr = r.body["data"]["speaker"];

  const decodedString = Buffer.from(vstr, "base64");

  // const out = fs.createWriteStream(filename);
  // out.write(decodedString);
  // out.close();

  const output_data = {
    status: msg,
    status_code: scode,
    duration: dur,
    data: decodedString,
    speaker: spkr,
  };

  return output_data;
};
