
const RickAndMortyApi = "https://rickandmortyapi.com/api/character"


const fetchData = async () => {
    const response = await fetch(RickAndMortyApi)
    const data = await response.json()
    return data
}

export default async function page() {
    const data = await fetchData()
    console.log(data)
    return (
        <div className="flex items-center justify-center flex-col">
            <h1 className="text-red-500 mt-10">
               <b>API: </b>"https://rickandmortyapi.com/api/character"
            </h1>
            <div className="grid grid-cols-2 gap-4 border-2 border-blue-500 p-4">
                {data.results.map(character => (
                    <CardCharacter key={character.id} character={character} />
                ))}
            </div>

        </div>
    )
}

function CardCharacter(props) {
    const { character } = props
    return (
        <div className="border-2 border-red-500 p-4 flex items-center justify-center flex-col bg-black">
            <img className="w-40 h-40 object-cover" src={character.image} alt={character.name} />
            <div className="text-green-200">
                <p >{character.name}</p>
                <p>{character.species}</p>
            </div>
        </div>
    )
}