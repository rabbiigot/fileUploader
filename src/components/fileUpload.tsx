import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUp} from '@fortawesome/free-solid-svg-icons';
import upload from '../download.png'
import logo from '../assets/473784450_963220275277928_6665052720062980500_n.png'

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isRedirected, setIsRedirected] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (window.location.search.includes('authenticated=true')) {
      checkAuthentication();
    } else {
      if (!isRedirected) {
        setIsRedirected(true); 
        window.location.href = 'https://fileuploaderbackend.onrender.com/auth/google'; 
      }
    }
  }, [isRedirected]);

  const checkAuthentication = async () => {
    try {
      const response = await fetch('https://fileuploaderbackend.onrender.com/api/checkAuth', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.authenticated) {
          setToken(data.token); 
        }
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const accessToken = await getCookie('access_token');
    if (!accessToken) {
      alert(`You are not authenticated. Please log in. ${token} && ${accessToken}`);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('https://fileuploaderbackend.onrender.com/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`, // Use the token directly in header
        },
      });
      alert('File uploaded successfully');
      console.log(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file.');
    }
  };

  const getCookie = (name: string): string | undefined => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
  };

  return (
    <div className="container">
        <img src={logo} alt="logo" style={{
            position: "absolute",
            height: "100px",
            paddingBottom:"530px",
            zIndex: "13"
        }}/>
      <div className="uploadBox">
        <div style={{position: "relative", fontWeight: "bold", fontSize: "25px", top: "0px", zIndex: "12"}}>File upload</div>
            <img src={upload} alt="cloud" style={{
                position: "relative",
                fontSize: "170px",
                top: "30px",
                outline: "2px solid white",
                zIndex: "12"
            }}/>
            
            <div style={{position: "relative", top: "60px"}}>
                <input
                    type="file"
                    onChange={handleFileChange}
                />

                <FontAwesomeIcon style={{fontSize: "50px", 
                    position: "absolute",
                    borderRadius: "30px",
                    border: "3px solid #5686e7",
                    background: "#5686e7",
                    color: "white",
                    marginRight: "260px",
                    marginTop: "-8px",
                    outline: "3px solid white"
                }} icon={faCircleUp} />
                
                <button onClick={handleFileUpload}>
                    Upload
                </button>
            </div>
        </div>
    </div>
  );
};

export default FileUpload;
