exports.WorkspaceInvitation = (owner, workspaceName, invitationUrl) => {
	return `<div style="display:flex; justify-content: center; align-items: center ; color: black ; ">
        <div
            style="display: flex; justify-content: center;border: 2px solid black; width: auto; height: auto; padding: 5px; background-color: rgb(22, 214, 248); border-radius: 5px ; ;">
            <div style="text-align: center ;">
                <h1>Join ${workspaceName} Workspace</h1>
                <h3>Hi Welcome to Project Manager</h3>

                <p>
                    ${owner} is inviting you to join ${workspaceName} workspace

                

                <p> To join the workspace visit the following link:</p>

                </p>
                <a href=${invitationUrl} style="border: 2px solid black ;padding: 7px ; border-radius: 15px; text-decoration: none ;background-color: rgb(40, 242, 13);
                color: black;
                    font-weight: bold;">Join ${workspaceName}
                    Workspace</a>

                <p>if this button does not work click on the below link</p>

                <p ><span>Link: </span> <a href=${invitationUrl} style="width: auto;">
                       ${invitationUrl}</a>
                </p>
            </div>
        </div>
    </div>`;
};

exports.createMailBody = message => {
	return `<div style="display:flex; justify-content: center; align-items: center ; color: black ; ">
        <div
            style="display: flex; justify-content: center;border: 2px solid black; width: auto; height: auto; padding: 5px;  border-radius: 5px ; ;">
            <div style="text-align: center ;">
                ${message}
            </div>
        </div>
    </div>`;
};
