<?php

namespace App\Console\Commands;

use App\Events\DashboardUpdated;
use Illuminate\Console\Command;

class SimulateLanding extends Command
{
    protected $signature = 'landing:simulate {--interval=4 : Detik antar event}';

    protected $description = 'Kirim event demo real-time ke dashboard landing page';

    public function handle(): int
    {
        $interval = max(1, (int) $this->option('interval'));

        $grades = [
            ['Kuis 4', 91],
            ['Tugas 4', 85],
            ['Kuis 5', 94],
            ['UAS', 89],
            ['Tugas 5', 92],
        ];

        $tasks = [
            ['title' => 'Laporan Praktikum 4', 'due' => 'Tenggat besok, 23.59', 'percent' => 60],
            ['title' => 'Proyek Basis Data', 'due' => 'Tenggat 3 hari lagi', 'percent' => 35],
            ['title' => 'Makalah Statistika', 'due' => 'Tenggat Jumat, 17.00', 'percent' => 80],
        ];

        $progress = 72;
        $now = 0;
        $i = 0;

        $this->info('Mengirim event ke channel "landing". Tekan Ctrl+C untuk berhenti.');

        while (true) {
            try {
                switch ($i % 4) {
                    case 0:
                        $progress = $progress >= 96 ? 60 : $progress + random_int(2, 5);
                        DashboardUpdated::dispatch('progress', ['value' => $progress]);
                        $this->line("progress → {$progress}%");
                        break;

                    case 1:
                        [$title, $score] = $grades[intdiv($i, 4) % count($grades)];
                        DashboardUpdated::dispatch('grade', ['title' => $title, 'score' => $score]);
                        $this->line("grade → {$title}: {$score}");
                        break;

                    case 2:
                        $now = ($now + 1) % 3;
                        DashboardUpdated::dispatch('schedule', ['now' => $now]);
                        $this->line("schedule → kelas ke-{$now}");
                        break;

                    case 3:
                        $task = $tasks[intdiv($i, 4) % count($tasks)];
                        DashboardUpdated::dispatch('task', $task);
                        $this->line("task → {$task['title']}");
                        break;
                }
            } catch (\Throwable $e) {
                $this->warn('Gagal kirim, dicoba lagi di putaran berikutnya: ' . $e->getMessage());
            }

            $i++;
            sleep($interval);
        }
    }
}
