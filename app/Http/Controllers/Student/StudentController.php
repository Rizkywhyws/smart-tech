<?php
namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    public function dashboard(Request $request): Response
    {
        return $this->page('Student/DashboardStudent', $request);
    }

    public function schedule(Request $request): Response
    {
        return $this->page('Student/JadwalStudent', $request);
    }

    public function tasks(Request $request): Response
    {
        return $this->page('Student/TugasStudent', $request);
    }

    public function grades(Request $request): Response
    {
        return $this->page('Student/NilaiStudent', $request);
    }

    public function subjects(Request $request): Response
    {
        return $this->page('Student/MapelStudent', $request);
    }

    private function page(string $component, Request $request): Response
    {
        $user = $request->user();

        return Inertia::render($component, [
            'user' => [
                'name' => $user->name,
                'role' => $user->role,
                'email' => $user->email,
                'identifier' => $user->identifier,
            ],
        ]);
    }
}
