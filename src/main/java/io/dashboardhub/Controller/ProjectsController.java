package io.dashboardhub.Controller;

import io.dashboardhub.Entity.Project;
import io.dashboardhub.Service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;
import java.util.concurrent.Future;

@Controller
@EnableOAuth2Sso
public class ProjectsController {

    @Autowired
    private ProjectService projectService;

    @RequestMapping("/projects")
    public String list(Model model) {
        // @TODO: should be getMyProjects
        Future<List<Project>> latest = projectService.getLatest();

        try {
            model.addAttribute("projects", latest.get());
        } catch(Exception e) {
            System.out.println("ERROR in async thread " + e.getMessage());
        }

        return "projects";
    }
}
