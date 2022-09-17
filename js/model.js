// getting JSON data from the API
export async function getData() {
  try {
    const res = await fetch("../products.json");
    if (!res) throw new Error("products are unavailable");
    const result = await res.json();
    return result;
  } catch (err) {
    alert(err);
  }
}
