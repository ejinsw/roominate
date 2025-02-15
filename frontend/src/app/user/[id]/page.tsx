import { User } from "@/types/types";

export default async function Page({ params }: { params: { id: string } }) {
  let user: User | null = {id: 1, email: "woneliajh11@ggjaklj", year: 1, name: "Elijah WOn"};
//   try {
//     const res = await fetch(`http://localhost:3000/api/users/${params.id}`);

//     if (!res.ok) {
//       return <>{"Couldn't get user"}</>;
//     }

//     user = await res.json();
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }

    return (
        <>
        <h1>User</h1>
        {user && (
            <>
            <div>{user.name}</div>
            <div>{user.email}</div>
            <div>{user.year}</div>
            </>
        )}
        </>
    );
}
