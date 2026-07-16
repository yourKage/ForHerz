Playlist — drop your MP3s here
================================

The music player is a skippable playlist. It looks for these files
(edit the list in lib/content.ts -> playlist):

  /public/music/blue.mp3               "Blue" — yung kai
  /public/music/golden-hour.mp3        "golden hour" — JVKE
  /public/music/until-i-found-you.mp3  "Until I Found You" — Stephen Sanchez

How to add a track:
  1. Get the MP3 (from a file you own).
  2. Rename it to match the src above (or change the src in lib/content.ts).
  3. Put it in this folder.
  4. Restart the dev server and hard-refresh.

Until a file exists, that track shows in the player but stays silent and
says "add <name>.mp3 to /public/music". You can add just one, or all three.

Copyright note: I can't legally bundle these tracks for you — use files you own.
