import { Box, Button, Stack, Typography } from "@mui/material";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const FileUpload = ({ uploadedFile, setUploadedFile }) => {
	const onDrop = useCallback(async (acceptedFiles) => {
		setUploadedFile(acceptedFiles[0]);
	}, []);

	const { getRootProps, getInputProps } = useDropzone({ onDrop });

	return (
		<Box display={"flex"} flexDirection={"column"} gap={1}>
			<Typography>Attachment *</Typography>
			<Stack
				sx={{ border: "1px solid black", borderRadius: "5px" }}
				padding={1}
				justifyContent={"center"}
				alignItems={"center"}
			>
				<div {...getRootProps()} className="dropzone">
					<input {...getInputProps()} />
					<Button>Drag and drop a file here, or click to select a file</Button>
				</div>
			</Stack>

			{uploadedFile && (
				<div>
					<h4>Uploaded File:</h4>
					<p>File Name: {uploadedFile.name}</p>
					<p>File Size: {uploadedFile.size} bytes</p>
					<p>File Type: {uploadedFile.type}</p>
				</div>
			)}
		</Box>
	);
};

export default FileUpload;
