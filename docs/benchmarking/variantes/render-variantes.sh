#!/bin/bash
cd "$(dirname "$0")"
for v in A B C; do
  sed -e "s#'capture.html'#'capture_$v.html'#; s#path.join(__dirname,'frames'#path.join(__dirname,'frames_$v'#" capture.cjs > capture_$v.cjs
  mkdir -p frames_$v; rm -f frames_$v/*.png
  node capture_$v.cjs > capture_$v.log 2>&1
  ffmpeg -y -hide_banner -loglevel error -framerate 24 -i frames_$v/f%05d.png -i ../music/cierre-mensual-mix-$v-norm.wav -vf "scale=1280:720:flags=lanczos,format=yuv420p" -c:v libx264 -preset medium -crf 18 -c:a aac -profile:a aac_low -ar 48000 -ac 2 -b:a 192k -shortest -movflags +faststart -metadata:s:a:0 language=spa cierre-mensual-variante-$v.mp4
  ffmpeg -y -hide_banner -loglevel error -ss 27 -t 24 -i cierre-mensual-variante-$v.mp4 -c:v libx264 -preset fast -crf 20 -c:a aac -ar 48000 -b:a 160k -movflags +faststart muestra-variante-$v-27s-51s.mp4
  echo "VARIANT_$v_DONE $(date)" >> capture_all.log
done
echo ALL_DONE >> capture_all.log
