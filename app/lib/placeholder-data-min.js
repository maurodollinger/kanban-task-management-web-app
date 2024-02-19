const boards = [
    {
        name: "Platform Launch",
        slug: "platform-launch",
        columns: [
            {
                name: "Todo",
                tasks: [
                    {
                        title: "Build UI for onboarding flow",
                        description: "",
                        status: "Todo",
                        subtasks: [
                            {
                                title: "Sign up page",
                                isCompleted: true
                            },
                            {
                                title: "Sign in page",
                                isCompleted: false
                            },
                            {
                                title: "Welcome page",
                                isCompleted: false
                            }
                        ]
                    },
                    {
                        title: "Build UI for search",
                        description: "",
                        status: "Todo",
                        subtasks: [
                            {
                                title: "Search page",
                                isCompleted: false
                            }
                        ]
                    }
                ]
            },
            {
                name: "Doing",
                tasks: [
                    {
                        title: "Design settings and search pages",
                        description: "",
                        status: "Doing",
                        subtasks: [
                            {
                                title: "Settings - Account page",
                                isCompleted: true
                            },
                            {
                                title: "Settings - Billing page",
                                isCompleted: true
                            },
                            {
                                title: "Search page",
                                isCompleted: false
                            }
                        ]
                    }
                ]
            },
            {
                name: "Done",
                tasks: [
                    {
                        title: "Conduct 5 wireframe tests",
                        description: "Ensure the layout continues to make sense and we have strong buy-in from potential users.",
                        status: "Done",
                        subtasks: [
                            {
                                title: "Complete 5 wireframe prototype tests",
                                isCompleted: true
                            }
                        ]
                    },
                    {
                        title: "Create wireframe prototype",
                        description: "Create a greyscale clickable wireframe prototype to test our asssumptions so far.",
                        status: "Done",
                        subtasks: [
                            {
                                title: "Create clickable wireframe prototype in Balsamiq",
                                isCompleted: true
                            }
                        ]
                    },
                    {
                        title: "Review results of usability tests and iterate",
                        description: "Keep iterating through the subtasks until we're clear on the core concepts for the app.",
                        status: "Done",
                        subtasks: [
                            {
                                title: "Meet to review notes from previous tests and plan changes",
                                isCompleted: true
                            },
                            {
                                title: "Make changes to paper prototypes",
                                isCompleted: true
                            },
                            {
                                title: "Conduct 5 usability tests",
                                isCompleted: true
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        name: "Marketing Plan",
        slug: "marketing-plan",
        columns: [
            {
                name: "Todo",
                tasks: [
                    {
                        title: "Plan Product Hunt launch",
                        description: "",
                        status: "Todo",
                        subtasks: [
                            {
                                title: "Find hunter",
                                isCompleted: false
                            },
                            {
                                title: "Gather assets",
                                isCompleted: false
                            },
                            {
                                title: "Draft product page",
                                isCompleted: false
                            },
                            {
                                title: "Notify customers",
                                isCompleted: false
                            },
                            {
                                title: "Notify network",
                                isCompleted: false
                            },
                            {
                                title: "Launch!",
                                isCompleted: false
                            }
                        ]
                    },
                    {
                        title: "Share on Show HN",
                        description: "",
                        status: "Todo",
                        subtasks: [
                            {
                                title: "Draft out HN post",
                                isCompleted: false
                            },
                            {
                                title: "Get feedback and refine",
                                isCompleted: false
                            },
                            {
                                title: "Publish post",
                                isCompleted: false
                            }
                        ]
                    },
                    {
                        title: "Write launch article to publish on multiple channels",
                        description: "",
                        status: "Todo",
                        subtasks: [
                            {
                                title: "Write article",
                                isCompleted: false
                            },
                            {
                                title: "Publish on LinkedIn",
                                isCompleted: false
                            },
                            {
                                title: "Publish on Inndie Hackers",
                                isCompleted: false
                            },
                            {
                                title: "Publish on Medium",
                                isCompleted: false
                            }
                        ]
                    }
                ]
            },
            {
                name: "Doing",
                tasks: []
            },
            {
                name: "Done",
                tasks: []
            }
        ]
    },
    {
        name: "Roadmap",
        slug: "roadmap",
        columns: [
            {
                name: "Now",
                tasks: [
                    {
                        title: "Launch version one",
                        description: "",
                        status: "Now",
                        subtasks: [
                            {
                                title: "Launch privately to our waitlist",
                                isCompleted: false
                            },
                            {
                                title: "Launch publicly on PH, HN, etc.",
                                isCompleted: false
                            }
                        ]
                    },
                    {
                        title: "Review early feedback and plan next steps for roadmap",
                        description: "Beyond the initial launch, we're keeping the initial roadmap completely empty. This meeting will help us plan out our next steps based on actual customer feedback.",
                        status: "Now",
                        subtasks: [
                            {
                                title: "Interview 10 customers",
                                isCompleted: false
                            },
                            {
                                title: "Review common customer pain points and suggestions",
                                isCompleted: false
                            },
                            {
                                title: "Outline next steps for our roadmap",
                                isCompleted: false
                            }
                        ]
                    }
                ]
            },
            {
                name: "Next",
                tasks: []
            },
            {
                name: "Later",
                tasks: []
            }
        ]
    }
];

module.exports = {
    boards
};
