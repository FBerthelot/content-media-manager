import React from "react";
import {ContentTypeNamesQuery} from "../gqlQueries";
import {from} from "rxjs";
import {filter, first, map} from 'rxjs/operators';
import {composeActions} from "@jahia/react-material";
import requirementsAction from "./requirementsAction";

export default composeActions(requirementsAction, {
    init:(context) => {
        context.initRequirements({requiredPermission: "jcr:addChildNodes"});

        if (!context.buttonLabel) {
            context.buttonLabel = "label.contentManager.create.contentOfType";
            let watchQuery = context.client.watchQuery({
                query: ContentTypeNamesQuery,
                variables: {nodeTypes: [context.contentType], displayLanguage: context.dxContext.uilang}
            });

            context.buttonLabelParams = from(watchQuery).pipe(
                filter(res => (res.data && res.data.jcr && res.data.jcr.nodeByPath)),
                first(),
                map(res => ({typeName: res.data.jcr.nodeTypesByNames[0].displayName}))
            );
        }
    },
    onClick:(context) => window.parent.authoringApi.createContent(context.path, [context.contentType], false)
});
