import { useNavigate } from 'react-router-dom';
import './FileUploader.css';

const FileUploader = ({ onFileUploaded = () => {} }) => {

    const navigate = useNavigate();

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                const lines = content.split('\n');
                onFileUploaded(lines);
                navigate('/data');
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="file-uploader">
            <h2>Upload File</h2>
            <input type="file" accept=".txt" onChange={handleFileUpload} />
        </div>
    );
};

export default FileUploader;
