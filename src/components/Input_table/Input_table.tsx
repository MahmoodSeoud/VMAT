import './Input_table.css'

type address = {
    address : number;
    bitLength : number;
    baseConversion: number;
    baseConversionPrefix: string;
}

type Input_tableProps = {
    given_virtual_address: address;
    virtual_address: address;
    phys_address: address;
}

function Input_table({given_virtual_address, virtual_address, phys_address} : Input_tableProps) {
    return (
    <>
        <div className="inputTable">
            <p><b>Virtual address: </b>{given_virtual_address.baseConversionPrefix+given_virtual_address.address.toString(given_virtual_address.baseConversion)}</p>
            <div className='virtualWrapper'>
                {Array(virtual_address.bitLength).fill(null).map((num, index) => (
                    <div className='inputWrapper'>
                        
                        <p className="pInput" style={{margin: 0}}>{virtual_address.bitLength-index-1}</p>
                        {/* // TODO make this when focused and clicked, select everything in the input field */}
                        {/* onClick={{this.select()} */}
                        <input className="bitInput" ></input> 
                    </div>
                ))}
            </div>
            <p></p>
        </div>
    </>
    )
}

export default Input_table;