// import GOstore from '../store/GOstore'

// const userRoles =
//   GOstore.state && GOstore.state.userDetails && GOstore.state.userDetails.roles
//     ? GOstore.state.userDetails.roles
//     : []

function mainMenu(userRoles: string[]) {
  console.log(userRoles)
  const toReturn = [
    // { title: 'My calendar', icon: 'event', location: '/calendar/timeGridWeek' },
    userRoles.includes('compere') || userRoles.includes('sysAdmin')
      ? {
          type: 'expander',
          title: 'Compère',
          icon: 'school',
          children: [
            {
              location: '/compere/adjudicators',
              title: 'Introduce adjudicators',
              icon: 'announcement',
              iconColor: 'info',
            },
            {
              location: '/compere/main',
              title: 'Compère',
              icon: 'view_list',
              iconColor: 'positive',
            },
          ],
        }
      : {},
    userRoles.includes('scrutineer') || userRoles.includes('sysAdmin')
      ? {
          type: 'expander',
          title: 'Scrutineer',
          icon: 'reduce_capacity',
          children: [
            {
              location: '/scrutineer/main',
              title: 'Scrutineer',
              icon: 'reduce_capacity',
              iconColor: 'positive',
            },
            {
              location: '/scrutineer/offbeat',
              title: 'Offbeat',
              icon: 'music_note',
              iconColor: 'info',
            },
            // {
            //   location: '/scrutineer/exceptions',
            //   title: 'Exceptions',
            //   icon: 'alarm',
            //   iconColor: 'negative',
            // },
          ],
        }
      : {},
    // userRoles.includes('scrutineer') || userRoles.includes('sysAdmin')
    //   ? {
    //       type: 'expander',
    //       title: 'Competition',
    //       icon: 'groups',
    //       children: [
    //         {
    //           location: '/scrutineer/events',
    //           title: 'Events',
    //           icon: 'list',
    //           iconColor: 'positive',
    //         },
    //         {
    //           location: '/scrutineer/competitors',
    //           title: 'Competitors',
    //           icon: 'people',
    //           iconColor: 'warning',
    //         },
    //         {
    //           location: '/scrutineer/judges',
    //           title: 'Judges',
    //           icon: 'person',
    //           iconColor: 'negative',
    //         },
    //         {
    //           location: '/scrutineer/floors',
    //           title: 'Floors',
    //           icon: 'room_preferences',
    //           iconColor: 'info',
    //         },
    //       ],
    //     }
    //   : {},
    // {
    //   type: 'expander',
    //   title: 'Results',
    //   icon: 'emoji_events',
    //   children: [
    //     {
    //       title: 'Results',
    //       icon: 'emoji_events',
    //       location: '/results',
    //       iconColor: 'positive',
    //     },
    //     userRoles.includes('sysAdmin')
    //       ? {
    //           title: 'Other results',
    //           icon: 'precision_manufacturing',
    //           location: '/results/other',
    //           iconColor: 'warning',
    //         }
    //       : {},
    //   ].filter((o) => {
    //     return o.title
    //   }),
    // },
    {
      location: '/release-notes',
      title: 'Release notes',
      icon: 'notes',
      iconColor: 'positive',
    },
    // {
    //   location: '/settings',
    //   title: 'Settings',
    //   icon: 'settings',
    //   iconColor: 'warning',
    // },
    // userRoles.includes('sysAdmin')
    //   ? {
    //       type: 'expander',
    //       title: 'Admin',
    //       icon: 'settings',
    //       children: [
    //         // {
    //         //   location: '/admin/errors',
    //         //   title: 'Error reports',
    //         //   icon: 'bug_report',
    //         //   iconColor: 'red',
    //         // },
    //         {
    //           location: '/admin/settings',
    //           title: 'Settings',
    //           icon: 'settings',
    //           iconColor: 'blue',
    //         },
    //       ],
    //     }
    //   : {},
  ]
  return toReturn
}

export default mainMenu
