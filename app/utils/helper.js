export const getCurrentUser = async () => {
  const userId = localStorage.getItem("userId");

  if (!userId) return null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/userDetails/${userId}`);
    const data = await res.json();
    console.log("data from helper of user: ", data);
    return data;
  } catch (err) {
    return null;
  }
};  