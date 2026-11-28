import { Head } from "@inertiajs/react";
import StudentLayout from "../../Components/StudentLayout";
import { ScheduleCard } from "../../Components/StudentCards";
import { useNow } from "../../lib/Student";

export default function Jadwal() {
    const now = useNow();

    return (
        <>
            <Head title="Jadwal Pelajaran: SmartTech" />
            <ScheduleCard now={now} />
        </>
    );
}

Jadwal.layout = (page) => (
    <StudentLayout title="Jadwal Pelajaran">{page}</StudentLayout>
);
