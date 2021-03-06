/**
 * ==========================================================================================
 * =                   JAHIA'S DUAL LICENSING - IMPORTANT INFORMATION                       =
 * ==========================================================================================
 *
 *                                 http://www.jahia.com
 *
 *     Copyright (C) 2002-2018 Jahia Solutions Group SA. All rights reserved.
 *
 *     THIS FILE IS AVAILABLE UNDER TWO DIFFERENT LICENSES:
 *     1/GPL OR 2/JSEL
 *
 *     1/ GPL
 *     ==================================================================================
 *
 *     IF YOU DECIDE TO CHOOSE THE GPL LICENSE, YOU MUST COMPLY WITH THE FOLLOWING TERMS:
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 *
 *     2/ JSEL - Commercial and Supported Versions of the program
 *     ===================================================================================
 *
 *     IF YOU DECIDE TO CHOOSE THE JSEL LICENSE, YOU MUST COMPLY WITH THE FOLLOWING TERMS:
 *
 *     Alternatively, commercial and supported versions of the program - also known as
 *     Enterprise Distributions - must be used in accordance with the terms and conditions
 *     contained in a separate written agreement between you and Jahia Solutions Group SA.
 *
 *     If you are unsure which license is appropriate for your use,
 *     please contact the sales department at sales@jahia.com.
 */
package org.jahia.modules.contentmanager.actionlists;

import java.util.Collection;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.jahia.modules.contentmanager.utils.Utils;
import org.jahia.osgi.BundleUtils;
import org.jahia.services.SpringContextSingleton;
import org.jahia.services.render.RenderContext;
import org.osgi.framework.Bundle;

public class TagFunctions {

    /**
     * Generates the list of actions for the Content and Media Manager.
     * 
     * @param renderContext current render context
     * @return a string representation of the JavaScript resources for action lists
     */
    public static String generateActionLists(RenderContext renderContext) {
        StringBuilder result = new StringBuilder();
        List<ActionListRenderer> actionListRenderers = getActionListRenderers();

        for (ActionListRenderer actionListRenderer : actionListRenderers) {
            result.append(actionListRenderer.renderActionList(renderContext));
        }

        return result.toString();
    }

    /**
     * Retrieves a list of namespaces (module names) that contain JavaScript locales.
     * 
     * @return a string representation of an array with all i18n namespaces
     */
    public static String getI18nNameSpaces() {
        Collection<Bundle> bundles = Utils.getBundlesWithActionListResources();
        Set<String> namespaces = new LinkedHashSet<>();
        for (Bundle bundle : bundles) {
            if (bundle.getEntry("/javascript/locales") != null) {
                namespaces.add(BundleUtils.getModuleId(bundle));
            }
        }

        return namespaces.isEmpty() ? "[]" : "['" + StringUtils.join(namespaces, "', '") + "']";
    }

    @SuppressWarnings("unchecked")
    private static List<ActionListRenderer> getActionListRenderers() {
        if (SpringContextSingleton.getInstance().isInitialized()) {
            return (List<ActionListRenderer>) SpringContextSingleton
                    .getBeanInModulesContext("org.jahia.modules.contentmanager.actionListRenderers");
        }
        return Collections.emptyList();
    }
}
