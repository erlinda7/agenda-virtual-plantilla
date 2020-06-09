import React, { useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
};

const activeStyle = {
  borderColor: '#2196f3',
};

const acceptStyle = {
  borderColor: 'lightBlue',
};

const rejectStyle = {
  borderColor: 'red',
};

function StyledDropzone(props) {
  const { text = 'sample' } = props;
  const multiple = props.multiple ? props.multiple : false;

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) props.onDrop(acceptedFiles);
    },
    [props],
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({ onDrop, accept: '.jpeg,.jpg,.png', multiple });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragAccept, isDragActive, isDragReject],
  );

  return (
    <div className="container">
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p>{text}</p>
      </div>
    </div>
  );
}

export default StyledDropzone;
