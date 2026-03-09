export default async function handler(req, res) {

if (req.method !== "POST") {
return res.status(405).json({ message: "Method not allowed" });
}

const { clubName, city, captainName, email, interest } = req.body;

console.log({
clubName,
city,
captainName,
email,
interest
});

return res.status(200).json({
message: "Signup received"
});

}