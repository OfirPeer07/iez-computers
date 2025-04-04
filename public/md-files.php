<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');

// Get the folder name from the URL parameter
$folderName = isset($_GET['folder']) ? $_GET['folder'] : '';

if (empty($folderName)) {
    echo json_encode([
        'error' => 'Folder name parameter is required',
        'files' => []
    ]);
    exit;
}

// Define the path to the markdown files
$mdPath = './md/' . $folderName;

if (!file_exists($mdPath) || !is_dir($mdPath)) {
    echo json_encode([
        'error' => 'Folder not found',
        'files' => []
    ]);
    exit;
}

// Get all files with .md or .MD extension
$files = [];
$dirHandle = opendir($mdPath);

if ($dirHandle) {
    while (($file = readdir($dirHandle)) !== false) {
        // Skip . and .. directories
        if ($file === '.' || $file === '..') {
            continue;
        }
        
        // Check if the file has a .md or .MD extension
        if (preg_match('/\.(md|MD)$/', $file)) {
            $files[] = [
                'name' => $file,
                'path' => '/md/' . $folderName . '/' . $file
            ];
        }
    }
    closedir($dirHandle);
}

// Return the files as JSON
echo json_encode([
    'files' => $files
]);
?>
