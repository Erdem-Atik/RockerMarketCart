
export async function getData() {

    const res = await fetch('../products.json');

    const reusult = await res.json();
    return reusult;
}
