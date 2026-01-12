import { useEffect } from "react";
import { getHealth } from "../lib/publicApi";

export default function TestBackend() {
    useEffect(() => {
        getHealth()
            .then(console.log)
            .catch(console.error);
    }, []);

    return <div>Open console – backend test</div>;
}
