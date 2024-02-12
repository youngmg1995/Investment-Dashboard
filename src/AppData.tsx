import React from 'react';

class AppData {
    input_file_ref: React.RefObject<File>;

    constructor(input_file: File | null = null) {
        this.input_file_ref = React.createRef<File>();
    }
}

export default AppData;