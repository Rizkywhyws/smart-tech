import { Head } from "@inertiajs/react";
import StudentLayout from "../../Components/StudentLayout";
import { SubjectsSection } from "../../Components/StudentCards";
import { useNow } from "../../lib/Student";

export default function Mapel() {
    const now = useNow();

    return (
        <>
            <Head title="Mata Pelajaran: SmartTech" />

            <StudentLayout title="Mata Pelajaran">
                <SubjectsSection now={now} />
            </StudentLayout>
        </>
    );
}