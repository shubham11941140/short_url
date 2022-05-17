set terminal png
set output "Latency.png"
set title "Latency Plot"
set xlabel "Time (Seconds)"
set ylabel "Latency (milliseconds)"
set y2label "Failures"
set y2tics 0, 300
plot "plot.txt" using 1:2 with linespoints title "Latency", "plot.txt" using 1:3 with linespoints title "Failures"
