import { ReportMenu } from "@kiosk/audit/components/ReportMenu/ReportMenu";
import { Flex, Group, List, Text, ThemeIcon } from "@mantine/core";
import { NavLink } from "@remix-run/react";
import { IconChecklist, IconTrophy } from "@tabler/icons-react";
import { routes } from "../../utils/constants/routes";
import { IconCalendarStats } from '@tabler/icons-react';

import classes from "./Navbar.module.css";

export const Navbar = () => {
  const navbarItems = [
    {
      label: "Case study",
      href: routes.CASE_STUDY.path,
      icon: IconTrophy,
    },
    {
      label: "Task Management",
      href: routes.TASKS.path,
      icon: IconCalendarStats,
    },
  ];

  return (
    <Flex direction="column" justify="space-between" h="100%">
      <List>
        {navbarItems.map((item) => (
          <List.Item key={"navbarItem" + item.label}>
            <NavLink to={item.href}>
              {({ isActive }) => (
                <Group
                  className={`${classes.navbar__item} ${
                    isActive ? classes["navbar__item--active"] : " "
                  }`}
                >
                  <ThemeIcon
                    className={
                      isActive
                        ? classes["navbar__icon--active"]
                        : classes.navbar__icon
                    }
                  >
                    <item.icon />
                  </ThemeIcon>
                  <Text
                    className={
                      isActive
                        ? classes["navbar__title--active"]
                        : classes.navbar__title
                    }
                  >
                    {item.label}
                  </Text>
                </Group>
              )}
            </NavLink>
          </List.Item>
        ))}
      </List>
      <ReportMenu />
    </Flex>
  );
};