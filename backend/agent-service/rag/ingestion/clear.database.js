import qdrantClient from "../../config/db.qdrant.js";

const clearCollection = async () => {

    try {

        await qdrantClient.deleteCollection(
            "electra_docs"
        );

        console.log(
            "Collection deleted"
        );

    } catch (error) {

        console.log(
            "Collection not found"
        );
    }
};

export default clearCollection;