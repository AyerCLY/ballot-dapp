import { useState, useEffect } from 'react';
import { ethers, utils } from "ethers";
import abi from "./contracts/Ballot.json";

function App() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isBallotOwner, setIsBallotOwner] = useState(false);
  const [inputValue, setInputValue] = useState({ proposal: ""});
  const [BallotOwnerAddress, setBallotOwnerAddress] = useState(null);
  const [customerAddress,setCustomerAddress] = useState(null);
  const [currentProposal, setCurrentProposal] = useState(null);
  const [votedYes, setVotedYes] = useState(null);
  const [votedNo, setVotedNo] = useState(null);
  const [VoterAddress, setVoterAddress] = useState(null);
  const [error, setError] = useState(null);

  const contractAddress = '0xc635054A34926B7Ee7774E8502cA518789e17a01';
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const account = accounts[0];
        setIsWalletConnected(true);
        setVoterAddress(account);
        console.log("Account Connected: ", account);
      } else {
        setError("Please install a MetaMask wallet to use our bank.");
        console.log("No Metamask detected");
      }
    } catch (error) {
      console.log(error);
    }
  }
//Get Proposal name (only view function , no gas fee)
  const getProposal = async () => {
    try {
      if (window.ethereum) {

        //read data
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const BallotContract = new ethers.Contract(contractAddress, contractABI, signer);

        let proposal = await BallotContract.proposal();
        proposal = utils.parseBytes32String(proposal);
        setCurrentProposal(proposal.toString());
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  //Set Proposal name (cost gas fee)
  const setProposalHandler = async (event) => {
    event.preventDefault();
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const BallotContract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn = await BallotContract.setProposal(utils.formatBytes32String(inputValue.proposal));
        console.log("Setting Proposal Name...");
        await txn.wait();
        console.log("Proposal Name Changed", txn.hash);
        getProposal();

      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
  }
//Ballot owner
  const getBallotOwnerHandler = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const BallotContract = new ethers.Contract(contractAddress, contractABI, signer);

        let owner = await BallotContract.DAOOwner();
        setBallotOwnerAddress(owner);

        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });

        if (owner.toLowerCase() === account.toLowerCase()) {
          setIsBallotOwner(true);
        }
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
  }

//Vote yes
  const VotedYesHandler = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const BallotContract = new ethers.Contract(contractAddress, contractABI, signer);

        let txn = await BallotContract.voteYes();
        await txn.wait(); 
        let yesCount = await BallotContract.getYesCount();
        setVotedYes(yesCount);
        console.log("Voted yes count", yesCount);

      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
  }
//Vote No
  const VotedNoHandler = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const BallotContract = new ethers.Contract(contractAddress, contractABI, signer);

        let txn = await BallotContract.voteNo();
        await txn.wait(); 
        let noCount = await BallotContract.getNoCount();
        setVotedNo(noCount);
        console.log("Voted no count", noCount);

      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleInputChange = (event) => {
    setInputValue(prevFormData => ({ ...prevFormData, [event.target.name]: event.target.value }));
  }


  useEffect(() => {
    checkIfWalletIsConnected();
    getProposal();
    getBallotOwnerHandler();
    VotedYesHandler()
    VotedNoHandler()
  }, [isWalletConnected])

  return (
    <main className="main-container">
      <h2 className="headline"><span className="headline-gradient">Ballot Project</span></h2>
      <section className="customer-section px-10 pt-5 pb-10">
        {error && <p className="text-2xl text-red-700">{error}</p>}
        <div className="mt-5">
          {currentProposal === "" && isBallotOwner ?
            <p>"Setup the name of your ballot." </p> :
            <p className="text-3xl font-bold">{currentProposal}</p>
          }
        </div>
        <div className="mt-7 mb-9">
          <form className="form-style">
            
            <button
              className="btn-purple"
              onClick={VotedYesHandler}>Vote Yes</button>
          </form>
        </div>
        <div className="mt-10 mb-10">
          <form className="form-style">

            <button
              className="btn-purple"
              onClick={VotedNoHandler}>Vote No</button>
          </form>
        </div>
        <div className="mt-5">
          <p><span className="font-bold">How many people voted Yes: </span>{votedYes}</p>
        </div>
        <div className="mt-5">
          <p><span className="font-bold">How many people voted No: </span>{votedNo}</p>
        </div>
        <div className="mt-5">
          <p><span className="font-bold">Ballot Owner Address: </span>{BallotOwnerAddress}</p>
        </div>
        <div className="mt-5">
          {isWalletConnected && <p><span className="font-bold">Your Wallet Address: </span>{VoterAddress}</p>}
          <button className="btn-connect" onClick={checkIfWalletIsConnected}>
            {isWalletConnected ? "Wallet Connected 🔒" : "Connect Wallet 🔑"}
          </button>
        </div>
      </section>
      {
        isBallotOwner && (
          <section className="ballot-owner-section">
            <h2 className="text-xl border-b-2 border-indigo-500 px-10 py-4 font-bold">Ballot Admin Panel</h2>
            <div className="p-10">
              <form className="form-style">
                <input
                  type="text"
                  className="input-style"
                  onChange={handleInputChange}
                  name="proposal"
                  placeholder="Enter your Ballot question."
                  value={inputValue.proposal}
                />
                <button
                  className="btn-grey"
                  onClick={setProposalHandler}>
                  Set Ballot question
                </button>
              </form>
            </div>
          </section>
        )
      }
    </main>
  );
}
export default App;