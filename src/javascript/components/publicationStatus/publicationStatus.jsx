import React from 'react';
import Moment from 'react-moment';
import 'moment-timezone';
import { isMarkedForDeletion } from '../utils';

class PublicationStatusUnpublished {

    getDetailsMessage(node, t) {
        return t("label.contentManager.publicationStatus.unPublished", {userName: node.lastPublishedBy, timestamp: node.lastPublished});
    }

    geti18nDetailsMessage(node, t, locale = "en") {
        return <React.Fragment>
            { t("label.contentManager.publicationStatus.unPublished", {userName: node.lastModifiedBy, timestamp: "" }) }
            <Moment format={"LLL"} locale={ locale }>{node.lastModified}</Moment>
        </React.Fragment>
    }

    getContentClass(classes) {
        return classes.unPublished;
    }
}

class PublicationStatusNotPublished {

    getDetailsMessage(node, t) {
        return t("label.contentManager.publicationStatus.notPublished");
    }

    geti18nDetailsMessage(node, t, locale = "en") {
        return t("label.contentManager.publicationStatus.notPublished");
    }

    getContentClass(classes) {
        return classes.notPublished;
    }
}

class PublicationStatusPublished {

    getDetailsMessage(node, t) {
        return t("label.contentManager.publicationStatus.published", {userName: node.lastPublishedBy, timestamp: node.lastPublished});
    }

    geti18nDetailsMessage(node, t, locale = "en") {
        return <React.Fragment>
            { t("label.contentManager.publicationStatus.published", {userName: node.lastPublishedBy, timestamp: ""}) }
            <Moment format={"LLL"} locale={ locale }>{node.lastPublished}</Moment>
        </React.Fragment>
    }

    getContentClass(classes) {
        return classes.published;
    }
}

class PublicationStatusModified {

    getDetailsMessage(node, t) {
        return t("label.contentManager.publicationStatus.modified", {userName: node.lastModifiedBy, timestamp: node.lastModified});
    }

    geti18nDetailsMessage(node, t, locale = "en") {
        return <React.Fragment>
            { t("label.contentManager.publicationStatus.modified", {userName: node.lastModifiedBy, timestamp: "" }) }
            <Moment format={"LLL"} locale={ locale }>{node.lastModified}</Moment>
        </React.Fragment>
    }

    getContentClass(classes) {
        return classes.modified;
    }
}

class PublicationStatusMarkedForDeletion {

    getDetailsMessage(node, t) {
        return t("label.contentManager.publicationStatus.markedForDeletion", {userName: node.deletedBy!==''? node.deletedBy : node.parentDeletionUser[0], timestamp: node.deleted!==''? node.deleted : node.parentDeletionDate[0]});
    }

    geti18nDetailsMessage(node, t, locale = "en") {
        return <React.Fragment>
            { t("label.contentManager.publicationStatus.markedForDeletion", {userName: node.deletedBy!=='' ? node.deletedBy : node.parentDeletionUser[0], timestamp: ""}) }
            <Moment format={"LLL"} locale={ locale }>{node.deleted!==''? node.deleted : node.parentDeletionDate[0]}</Moment>
        </React.Fragment>
    }

    getContentClass(classes) {
        return classes.markedForDeletion;
    }
}


export const publicationStatusByName = {
    "UNPUBLISHED": new PublicationStatusUnpublished(),
    "NOT_PUBLISHED": new PublicationStatusNotPublished(),
    "PUBLISHED": new PublicationStatusPublished(),
    "MODIFIED": new PublicationStatusModified(),
    "MARKED_FOR_DELETION": new PublicationStatusMarkedForDeletion(),
    getStatus: function(node) {
        if (isMarkedForDeletion(node)) {
            return this['MARKED_FOR_DELETION'];
        }
        return this[node.publicationStatus];
    }
};
