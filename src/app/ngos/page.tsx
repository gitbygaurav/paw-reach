import NgoCard from "@/ui/NgoCard";

export const ngos = [
    {
        id: 1,
        name: 'Happy Paws',
        services: 'Medical, Shelter',
        contact: '123-456-7890',
        rating: 4.5,
        location: [51.505, -0.09],
        address: "123, Main Street, London",
    },
    {
        id: 2,
        name: 'Safe Haven',
        services: 'Rescue, Shelter',
        contact: '987-654-3210',
        rating: 4.8,
        location: [51.515, -0.1],
        address: "123, Main Street, London",
    },
    {
        id: 3,
        name: 'Animal Aid',
        services: 'Medical, Rescue',
        contact: '555-555-5555',
        rating: 4.2,
        location: [51.525, -0.11],
        address: "123, Main Street, London",
    },
];

const Page: React.FC = () => {
    return (
        <div className="pt-32 px-4">
            <h3 className="text-5xl text-black text-center font-extrabold">NGOs  List</h3>
            <p className="text-lg text-center font-semibold mt-2"><span className="text-green-900">{ngos.length}</span> ngos are with us and many more are joining.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {ngos.map((ngo) => (
                    <NgoCard key={ngo.id} id={ngo.id.toString()} name={ngo.name} services={ngo.services} contact={ngo.contact} rating={ngo.rating} address={ngo.address} />
                ))}
            </div>
        </div>
    )
}

export default Page;