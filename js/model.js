// getting JSON data from the API
export async function getData() {
    try{
        const res = await fetch('../products.json');  
        const result = await res.json();
    return result;
    } catch(err) {
            console.log(err);
    }   
}
