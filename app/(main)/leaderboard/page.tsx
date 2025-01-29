import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; // Your next-auth configuration
import AuthError from "@/components/authError";
import Loading from "@/components/loading";
import { Crown } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  // Fetch the session server-side
  const session = await getServerSession(authOptions);

  if (!session) {
    return <AuthError />;
  }

  // Fetch the leaderboard data server-side
  let leaderboard = [];
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/leaderboard`, {
      cache: "no-store", // Force dynamic fetching
    });

    if (!res.ok) {
      throw new Error("Failed to fetch leaderboard");
    }

    const data = await res.json();
    leaderboard = data
      .sort(
        (a: { totalScore: number }, b: { totalScore: number }) =>
          b.totalScore - a.totalScore
      )
      .map((user: any, index: number) => ({
        ...user,
        rank: index + 1, // Assign rank based on position
      }));
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return (
      <div className="flex flex-col justify-center items-center mt-[20vh]">
        <h1 className="text-2xl sm:text-2xl text-center text-rose-500 font-bold">
          Error fetching leaderboard data. Please try again later.
        </h1>
      </div>
    );
  }

  // Helper function to calculate the level
  const getLevel = (score: number): string => {
    if (score < 200) return "[0x1][Newbie]";
    if (score < 500) return "[0x2][Scout]";
    if (score < 1000) return "[0x3][Codebreaker]";
    if (score < 1500) return "[0x4][Hacker]";
    if (score < 2000) return "[0x5][Cipher Hunter]";
    if (score < 3000) return "[0x6][Forger]";
    return "[0x7][Flag Conqueror]";
  };

  return (
    <div className="flex flex-col justify-center items-center mt-16 px-8">
      <h1 className="text-3xl sm:text-3xl tracking-tight text-center text-rose-500 font-bold mb-4">
        Leaderboard
      </h1>
      <div className="w-full max-screen-w-2xl p-4">
        {leaderboard.length === 0 ? (
          <p className="text-center text-gray-500">No data available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {leaderboard.map((user: any, index: number) => (
              <div
                className={`${index === 0 ? "col-span-full" : ""}`}
                key={user.rank}
              >
                {user.totalScore > 0 ? (
                  <div
                    className={`flex flex-col bg-gray-50 rounded-lg px-6 py-5 shadow-lg shadow-gray-100 relative overflow-clip border border-gray-200`}
                  >
                    <span className="text-xl font-bold text-rose-500 absolute top-2 right-4">
                      #{user.rank}
                    </span>
                    <img
                      src={user.image || ""}
                      alt={`${user.name}'s avatar`}
                      className="w-20 h-20 rounded-full object-cover mb-2"
                    />
                    <span className="font-medium text-sm text-rose-400">
                      {getLevel(user.totalScore)}
                    </span>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {user.name}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Score: {user.totalScore}
                    </p>
                    {index === 0 && (
                      <div className="absolute right-0 bottom-0 w-20 h-16 bg-pink-600 [clip-path:polygon(100%_0,0_100%,100%_100%)]">
                        <div className="absolute right-2 bottom-2">
                          <Crown color="white" />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  ""
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// "use client";

// import React, { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import Loading from "@/components/loading";
// import AuthError from "@/components/authError";
// import { Crown } from "lucide-react";

// const LeaderboardPage = () => {
//   const { status: sessionStatus } = useSession();

//   const [leaderboard, setLeaderboard] = useState<
//     {
//       name: string;
//       totalScore: number;
//       rank: number;
//       image: string;
//       question: any;
//     }[]
//   >([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const getLevel = (score: number): string => {
//     if (score < 200) return "[0x1][Newbie]";
//     if (score < 500) return "[0x2][Scout]";
//     if (score < 1000) return "[0x3][Codebreaker]";
//     if (score < 1500) return "[0x4][Hacker]";
//     if (score < 2000) return "[0x5][Cipher Hunter]";
//     if (score < 3000) return "[0x6][Forger]";
//     return "[0x7][Flag Conqueror]";
//   };

//   useEffect(() => {
//     let intervalId: NodeJS.Timeout;
//     const fetchLeaderboard = async () => {
//       try {
//         const res = await fetch("/api/leaderboard", {
//           next: { revalidate: 1000 },
//         });
//         if (!res.ok) {
//           throw new Error("Failed to fetch leaderboard");
//         }
//         const data = await res.json();
//         setLeaderboard(
//           data
//             .sort(
//               (a: { totalScore: number }, b: { totalScore: number }) =>
//                 b.totalScore - a.totalScore
//             ) // Sort by score in descending order
//             .map((user: any, index: number) => ({
//               ...user,
//               rank: index + 1, // Assign rank based on position
//             }))
//         );
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (sessionStatus === "authenticated") {
//       fetchLeaderboard();
//       intervalId = setInterval(fetchLeaderboard, 2000);
//     }
//     return () => {
//       if (intervalId) clearInterval(intervalId); // Cleanup on unmount
//     };
//   }, [sessionStatus]);

//   if (sessionStatus === "loading" || loading) {
//     return <Loading />;
//   }

//   if (sessionStatus === "unauthenticated") {
//     return <AuthError />;
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col justify-center items-center mt-[20vh]">
//         <h1 className="text-2xl sm:text-2xl text-center text-rose-500 font-bold">
//           Error: {error}
//         </h1>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col justify-center items-center mt-16 px-8">
//       <h1 className="text-3xl sm:text-3xl tracking-tight text-center text-rose-500 font-bold mb-4">
//         Leaderboard
//       </h1>
//       <div className="w-full max-screen-w-2xl p-4">
//         {leaderboard.length === 0 ? (
//           <p className="text-center text-gray-500">No data available</p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//             {leaderboard.map((user, index) => (
//               <div
//                 className={`${index === 0 ? "col-span-full" : ""} ${
//                   index > 4 ? "" : ""
//                 }`}
//                 key={index}
//               >
//                 {user.totalScore > 0 ? (
//                   <div
//                     key={user.rank}
//                     className={`flex flex-col bg-gray-50 rounded-lg px-6 py-5 shadow-lg shadow-gray-100 relative overflow-clip border border-gray-200`}
//                   >
//                     <span className="text-xl font-bold text-rose-500 absolute top-2 right-4">
//                       #{user.rank}
//                     </span>
//                     <img
//                       src={user.image || ""}
//                       alt={`${user.name}'s avatar`}
//                       className="w-20 h-20 rounded-full object-cover mb-2"
//                       // onError={(e) =>
//                       //   (e.currentTarget.src = "/fallback-avatar.png")
//                       // }
//                     />
//                     <span className="font-medium text-sm text-rose-400">
//                       {getLevel(user.totalScore)}
//                     </span>
//                     <h2 className="text-lg font-semibold text-gray-800">
//                       {user.name}
//                     </h2>
//                     <p className="text-sm text-gray-600">
//                       Score: {user.totalScore}
//                     </p>

//                     {index === 0 ? (
//                       <div className="absolute right-0 bottom-0 w-20 h-16 bg-pink-600 [clip-path:polygon(100%_0,0_100%,100%_100%)]">
//                         <div className="absolute right-2 bottom-2">
//                           <Crown color="white" />
//                         </div>
//                       </div>
//                     ) : (
//                       ""
//                     )}
//                   </div>
//                 ) : (
//                   ""
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LeaderboardPage;
// export const dynamic = "force-dynamic";
