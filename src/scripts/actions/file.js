import * as actions from '../constants/ActionTypes.js';

export function fileSelected(id, file) {
    return { type: actions.FILE_SELECTED, id, file };
}

export function fileSelectedAll(id) {
    return { type: actions.FILE_DESELECTED_ALL, id };
}

export function fileGroupSelected(id, file) {
    return { type: actions.FILE_GROUP_SELECTED, id, file };
}

export function fileDeselected(id, file) {
    return { type: actions.FILE_DESELECTED, id, file };
}

export function fileDeselectedAll(id) {
    return { type: actions.FILE_DESELECTED_ALL, id };
}

export function fileDownloadRequest(id, filename, path) {
    return { type: actions.FILE_DOWNLOAD_REQUEST, id, filename, path };
}

export function fileTransferRequest(src, dest, srcpath, destpath) {
    return { type: actions.FILE_TRANSFER_REQUEST, id: -1, src, dest, srcpath, destpath };
}

export function directoryTransferRequest(src, dest, srcpath, destpath) {
    return { type: actions.DIRECTORY_TRANSFER_REQUEST, id: -1, src, dest, srcpath, destpath };
}
