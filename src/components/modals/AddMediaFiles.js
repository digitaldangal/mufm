import React from 'react'
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap'
import Dropzone from "react-dropzone"
import {addFile, addDuration, addCover} from "../../actions/playlistActions"
import PropTypes from "prop-types"
import {connect} from "react-redux"
import {secondsToHms, addTimes,} from "../../shared/TimeFunctions"
import {parse} from 'id3-parser'
import {convertFileToBuffer} from 'id3-parser/lib/universal/helpers'
import * as jsmediatags from "jsmediatags"


class AddMediaFiles extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id: ''
        }
        this.onDrop = this.onDrop.bind(this)
        this.onDropRejected = this.onDropRejected.bind(this)
    }


    onDrop(acceptedFiles) {
        if (acceptedFiles.length > 0) {
            let id = this.props.files.length + 1

            for (let i = 0; i < acceptedFiles.length; i++) {

                // acceptedFiles.map(file => {
                // cons"./music-acceptedFiles[i].mp3"ole.log(file)
                this.props.addFile({
                    id: id++,
                    name: acceptedFiles[i].name,
                    path: acceptedFiles[i].path,
                    duration: '',
                    played: false,
                    isDuration: false,
                    startTime: '',
                    isCover: false
                })

                jsmediatags.read(acceptedFiles[i], {
                    onSuccess: (tag) => {

                        const image = tag.tags.picture
                        if (image) {
                            let base64String = ""
                            for (let i = 0; i < image.data.length; i++) {
                                base64String += String.fromCharCode(image.data[i])
                            }
                            let base64 = "data:" + image.format + ";base64," + window.btoa(base64String)
                            // console.log(base64)
                            this.props.addCover({
                                path: acceptedFiles[i].path,
                                cover: base64
                            })
                        }
                    }
                })
                const audio = new Audio()
                audio.src = acceptedFiles[i].path
                audio.onloadedmetadata = () => {
                    const duration = secondsToHms(audio.duration)
                    let endTime = ''
                    if (localStorage.getItem(new Date().toISOString().split("T")[0])) {
                        endTime = JSON.parse(localStorage.getItem(new Date().toISOString().split("T")[0])).endTime
                    }
                    let startTime = ''
                    if (JSON.parse(localStorage.getItem(new Date().toISOString().split("T")[0]))) {
                        startTime = JSON.parse(localStorage.getItem(new Date().toISOString().split("T")[0])).time
                    }

                    this.props.addDuration({
                        name: acceptedFiles[i].name,
                        path: acceptedFiles[i].path,
                        duration: duration,
                        played: false,
                        startTime: endTime ? endTime : startTime ? startTime : '',
                        isDuration: true
                    })
                    if (localStorage.getItem(new Date().toISOString().split("T")[0])) {
                        let todayStore = JSON.parse(localStorage.getItem(new Date().toISOString().split("T")[0]))
                        todayStore = {
                            date: todayStore.date,
                            time: todayStore.time,
                            endTime: addTimes(endTime ? endTime : startTime, duration)
                        }
                        localStorage.setItem(new Date().toISOString().split("T")[0], JSON.stringify(todayStore))
                    }
                }
                // })
                //     onError: function(error) {
                //


                // onError: function (error) {
                //     console.log(':(', error.type, error.info)
                //
                // }
            }
            // )

            // console.log(':(', error.type, error.info)
        }

// });

// })
        this.props.onClose()
// }
// );

//     const reader = new FileReader()
//     reader.onload = () => {
//         const fileAsBinaryString = reader.result
//       console.log(fileAsBinaryString)
//     }
//     reader.onabort = () => console.log('file reading was aborted')
//     reader.onerror = () => console.log('file reading has failed')
//
//     reader.readAsBinaryString(file)
// }
    }

    onDropRejected(...args) {
        console.log('reject', args)
    }

    render() {

        const {show, onClose,} = this.props
        if (show) {
            return (
                <Modal isOpen={show} toggle={onClose} size="sm">
                    <ModalHeader toggle={onClose}>Add media files</ModalHeader>
                    <ModalBody>
                        <Dropzone onDrop={this.onDrop} accept="audio/*,video/*" multiple={true}
                                  onDropRejected={this.onDropRejected}>
                            Drag file(s) here or click to upload.
                        </Dropzone>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="dark btn-sm" onClick={onClose}>Cancel</Button>{' '}
                    </ModalFooter>
                </Modal>
            )
        }
        else return null

    }
}

AddMediaFiles.propTypes = {
    addFile: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    addDuration: PropTypes.func.isRequired,
    addCover: PropTypes.func.isRequired,
    // files: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
    return {files: state.playlistReducers}
}

export default connect(mapStateToProps, {addFile, addDuration, addCover})(AddMediaFiles)