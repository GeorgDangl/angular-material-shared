If (Test-Path "$PSScriptRoot\coverage"){
	Remove-Item "$PSScriptRoot\coverage" -Force -Recurse
}

If (Test-Path "$PSScriptRoot\karma-results.xml"){
	Remove-Item "$PSScriptRoot\karma-results.xml"
}

& npm install
& npm run test
