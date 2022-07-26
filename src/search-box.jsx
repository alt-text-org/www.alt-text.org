import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

function FileSearch(props) {
    const { submit } = props
    const [file, setFile] = React.useState(null);

    const handleSubmit = () => {
        submit(file)
    }

    const handleSelectFile = (event) => {
        setFile(event.target.files[0])
    }

    return <div className="file-search-wrapper">
        <div>
            <input id="file-select" type="file" onChange={handleSelectFile}/>
        </div>
        <div>
            <button onClick={handleSubmit} disabled={!file}>Search</button>
        </div>
    </div>
}

function UrlSearch(props) {
    const { submit } = props
    const [url, setUrl] = React.useState("");

    const handleSubmit = () => {
        submit(url)
    }

    const handleChange = (event) => {
        setUrl(event.target.value)
    }

    return <div className="url-search-wrapper">
        <div>
            <input id="url-select" type="text" onChange={handleChange}/>
        </div>
        <div>
            <button onClick={handleSubmit} disabled={!url}>Search</button>
        </div>
    </div>
}

export default function SearchBox(props) {
    const { submitFile, submitUrl } = [props]
    const [value, setValue] = React.useState('file');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="Image sources">
                        <Tab label="On Your Computer" value="file" />
                        <Tab label="On The Web" value="url" />
                    </TabList>
                </Box>
                <TabPanel value="file">
                    <FileSearch submit={submitFile}></FileSearch>
                </TabPanel>
                <TabPanel value="url"><UrlSearch submit={submitUrl}></UrlSearch></TabPanel>
            </TabContext>
        </Box>
    );
}
