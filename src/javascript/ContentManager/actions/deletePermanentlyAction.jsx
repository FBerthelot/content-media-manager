import {hasMixin} from '../ContentManager.utils';
import {map} from 'rxjs/operators';
import {composeActions} from '@jahia/react-material';
import requirementsAction from './requirementsAction';

export default composeActions(requirementsAction, {
    init: context => {
        context.initRequirements({
            retrieveProperties: {retrievePropertiesNames: ['jcr:mixinTypes']},
            requiredPermission: 'jcr:removeNode',
            retrieveDisplayName: true,
            enabled: context => context.node.pipe(map(node => hasMixin(node, 'jmix:markedForDeletionRoot') && node.aggregatedPublicationInfo.publicationStatus === 'NOT_PUBLISHED'))
        });
    },
    onClick: context => {
        if (context.node) {
            window.parent.authoringApi.deleteContent(context.node.uuid, context.node.path, context.node.displayName, ['jnt:content'], ['nt:base'], false, true);
        } else if (context.nodes) {
            window.parent.authoringApi.deleteContents(context.nodes.map(node => ({uuid: node.uuid, path: node.path, displayName: node.displayName, nodeTypes: ['jnt:content'], inheritedNodeTypes: ['nt:base']})), false, true);
        }
    }
});
