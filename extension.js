const vscode    = require('vscode');
const path      = require('path');
const { spawn } = require('child_process');
const os        = require('os');

const openedFileNames = [];

function activate(context) {

	vscode.workspace.onDidOpenTextDocument(e => {

		openedFileNames.push(e.fileName);

		const ext = e.fileName.split('.').reverse()[0];
		switch(ext) {

			case 'ymap':
			case 'ytyp':
			case 'ymt': {

				const gtautil = spawn('GTAUtil', ['exportmeta', '-i', e.fileName]);

				gtautil.stdout.on('data', data => {
					console.log(data);
				});

				gtautil.stderr.on('data', data => {
					console.log(data);
				});

				gtautil.on('exit', code => {

					const openPath = vscode.Uri.parse('file:///' + e.fileName + '.xml');
					
					vscode.workspace.openTextDocument(openPath).then(doc => {
						 vscode.window.showTextDocument(doc);
					});

				});

				break;
			}

			default: break;

		}

	});

	vscode.workspace.onDidCloseTextDocument(e => {

		const idx = openedFileNames.indexOf(e.fileName);

		if(idx !== -1)
			openedFileNames.splice(idx, 1);

	});

	vscode.workspace.onDidSaveTextDocument(e => {

		if(openedFileNames.indexOf(e.fileName) !== -1) {

			const gtautil = spawn('GTAUtil', ['importmeta', '-i', e.fileName]);

			gtautil.stdout.on('data', data => {
				console.log(data);
			});

			gtautil.stderr.on('data', data => {
				console.log(data);
			});

		}

	});
}

exports.activate = activate;

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
