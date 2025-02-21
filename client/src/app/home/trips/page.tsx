import Link from "next/link";

export default function Trips() {
    return (
        <div className="flex justify-between items-center px-6 py-2">
        <h1>Trips</h1>
        <Link 
        href={'/home/trips/new'}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded capitalize transition duration-300 ease-in-out "
        >
            add trip
        </Link>
        </div>
    );
    }