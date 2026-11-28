import { Head } from "@inertiajs/react";
import StudentLayout from "../../Components/StudentLayout";
import { AttendanceCard, GradesCard } from "../../Components/StudentCards";

export default function Nilai() {
    return (
        <>
            <Head title="Nilai dan Presensi: SmartTech" />

            <StudentLayout title="Nilai dan Presensi">
                <div className="grid gap-6 lg:grid-cols-12">
                    <GradesCard className="h-full lg:col-span-7" />
                    <AttendanceCard className="lg:col-span-5 lg:self-start" />
                </div>
            </StudentLayout>
        </>
    );
}