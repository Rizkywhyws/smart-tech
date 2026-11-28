import { Head } from "@inertiajs/react";
import StudentLayout from "../../Components/StudentLayout";
import { TasksCard } from "../../Components/StudentCards";

export default function Tugas() {
    return (
        <>
            <Head title="Tugas dan Ujian: SmartTech" />

            <StudentLayout title="Tugas dan Ujian">
                <TasksCard />
            </StudentLayout>
        </>
    );
}