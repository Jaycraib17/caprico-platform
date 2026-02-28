import useAuth from "@/utils/useAuth";

export default function LogoutPage() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#FAFAFA] p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5E6E8]">
          <span className="text-3xl">👋</span>
        </div>

        <h1 className="mb-4 text-2xl font-bold text-[#2D2D2D]">Sign Out</h1>

        <p className="mb-8 text-[#6B6B6B]">
          Are you sure you want to sign out?
        </p>

        <button
          onClick={handleSignOut}
          className="w-full rounded-xl bg-[#D4A5A5] px-4 py-3.5 text-base font-bold text-white shadow-lg shadow-[#D4A5A5]/30 transition-all hover:bg-[#C4958F] focus:outline-none focus:ring-2 focus:ring-[#D4A5A5] focus:ring-offset-2"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
