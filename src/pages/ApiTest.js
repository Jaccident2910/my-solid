import { useEffect} from 'react';

export default function ApiTest() {

    
    useEffect(() => {
        // POST request using fetch inside useEffect React hook
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name:"Mortimer the Shortimer" })
        };
        fetch('http://localhost:8000/items/', requestOptions)
            .then(response => response.json())
            .then(data => console.log(data));
    
    // empty dependency array means this effect will only run once (like componentDidMount in classes)
    }, []);


}