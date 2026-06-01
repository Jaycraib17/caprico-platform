import * as React from "react";
import { useSession } from "@auth/create/react";

const useUser = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = React.useState(null);
  const [userLoading, setUserLoading] = React.useState(true);

  React.useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated" || !session?.user) {
      setUser(null);
      setUserLoading(false);
      return;
    }

    // Fetch is_admin and merge into the session user
    fetch("/api/admin/check")
      .then((r) => r.json())
      .then((adminData) => {
        setUser({ ...session.user, is_admin: !!adminData.isAdmin });
        setUserLoading(false);
      })
      .catch(() => {
        setUser({ ...session.user, is_admin: false });
        setUserLoading(false);
      });
  }, [status, session?.user?.id]);

  const refetch = React.useCallback(() => {}, []);

  return {
    user,
    data: user,
    loading: status === "loading" || userLoading,
    refetch,
  };
};

export { useUser };
export default useUser;
