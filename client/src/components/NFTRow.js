import React, {useState, useEffect} from 'react'

function NFTRow(props){

    const [owner, setOwner] = useState('')
    // const [imageURL, setImageURL] = useState('')

    const load = async() => {
        let owner = ''
        try{
            owner = await props.contract.methods.ownerOf(props.id).call()
            setOwner(owner)

        } catch {
            owner = 'pending...'
            setOwner(owner)

            setInterval(() => {
                load()
            }, 2000)
        }        
    }

    useEffect(() => {
        load()
    }, [])

    return(
        <tr>
            <td>{props.id}</td>
            <td>{owner}</td>
            <td>
            </td>
        </tr>
    )
}

export default NFTRow