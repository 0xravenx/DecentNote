// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DecentNote {
    struct Note {
        string ipfsHash;
        address owner;
        uint256 timestamp;
        bool isPrivate;
    }

    mapping(uint256 => Note) public notes;
    mapping(address => uint256[]) public userNotes;
    uint256 public noteCount;

    event NoteCreated(uint256 indexed noteId, address indexed owner, string ipfsHash);
    event NoteUpdated(uint256 indexed noteId, string newIpfsHash);

    function createNote(string memory _ipfsHash, bool _isPrivate) public returns (uint256) {
        noteCount++;

        notes[noteCount] = Note({
            ipfsHash: _ipfsHash,
            owner: msg.sender,
            timestamp: block.timestamp,
            isPrivate: _isPrivate
        });

        userNotes[msg.sender].push(noteCount);

        emit NoteCreated(noteCount, msg.sender, _ipfsHash);
        return noteCount;
    }

    function updateNote(uint256 _noteId, string memory _newIpfsHash) public {
        require(_noteId > 0 && _noteId <= noteCount, "Invalid note ID");
        require(notes[_noteId].owner == msg.sender, "Not the owner");

        notes[_noteId].ipfsHash = _newIpfsHash;
        notes[_noteId].timestamp = block.timestamp;

        emit NoteUpdated(_noteId, _newIpfsHash);
    }

    function getNote(uint256 _noteId) public view returns (string memory, address, uint256, bool) {
        require(_noteId > 0 && _noteId <= noteCount, "Invalid note ID");
        Note memory note = notes[_noteId];

        if (note.isPrivate && note.owner != msg.sender) {
            return ("", note.owner, note.timestamp, note.isPrivate);
        }

        return (note.ipfsHash, note.owner, note.timestamp, note.isPrivate);
    }

    function getUserNotes(address _user) public view returns (uint256[] memory) {
        return userNotes[_user];
    }
}