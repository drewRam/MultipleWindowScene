import React, { useEffect } from 'react';
import WindowManager from './WindowManager';

function App() {
    useEffect(() => {
        const windowManager = new WindowManager();

        // Define metadata for the window
        const metaData = { foo: "bar" };

        // Initialize the window manager
        windowManager.init(metaData);

        // Set up shape change callback
        windowManager.setWinShapeChangeCallback(() => {
            // Handle shape change here
        });

        // Set up window change callback
        windowManager.setWinChangeCallback(() => {
            // Handle window change here
        });

        // Clean up function
        return () => {
            // Clean up resources if needed
        };
    }, []);

    return (
        <div>
            {/* Your JSX content goes here */}
        </div>
    );
}

export default App;
