import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Tooltip from "../ToolTip/Tooltip";
import Grid from "@mui/material/Grid";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { alpha } from "@mui/material/styles";
import { blueGrey } from "@mui/material/colors";
import { CircularProgress, Stack, Typography } from "@mui/material";
import ConfirmButton from "../Buttons/ConfirmButton";
import { Box } from "@mui/system";
import useStore from "../../store/useStore";
import shallow from "zustand/shallow";


const StakeSwitch = styled(Switch)(() => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: blueGrey[100],
    "&:hover": {
      backgroundColor: alpha(blueGrey[500], 0.2),
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: blueGrey[100],
  },
}));

const SelectBackground = styled.div`
  background-color: #bbabe34d;
  border-radius: 16px;
  width: 100%;
  margin: 0 auto;
  margin-bottom: 30px;
  justify-content: center;
  position: relative;
  border-top: 7.5px groove #e6e6fa;
  border-bottom: 7.5px ridge #e6e6fa;
`;

const SmallBackground = styled.div`
  background-color: #bbabe34d;
  border-radius: 16px;
  width: 100%;
  justify-content: center;
  position: relative;
  border-top: 5px groove #e6e6fa;
  border-bottom: 5px ridge #e6e6fa;
`;

const SmallHeader = styled.p`
  font-size: 4vmin;
  font-weight: 550;
  border-bottom: 3.5px ridge #e6e6fa;
  padding-top: 2.5%;
  padding-bottom: 2.5%;
`;

const SelectHeader = styled.p`
  padding-top: 3.75%;
  font-weight: 550;
  font-size: 3.5vmin;
`;

const InputContainer = styled.div`
  width: 60%;
  height: 12.5%;
  background: hsl(287, 76%, 13%);
  border: 5px solid hsl(287, 90%, 13%);
  box-sizing: border-box;
  border-radius: 16px;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  margin-bottom: 11%;
`;

const SelectToken = styled.div`
  width: 15%;
  color: white;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const TokenIcon = styled.img`
  width: 50%;
  position: relative;
  right: 35%;
`;

const TokenName = styled.header`
  position: relative;
  font-weight: 535;
  right: 15%;
  &:hover {
    color: #bbabe3;
  }
`;

function StakeUI({
  handleClickOnApproveBtn,
  handleClickOnConfirmBtn,
  handleOnAmountSelect,
  stakingStats,
  stakingEstimates,
  account
}) {
  const [period, setPeriod] = useState(false);
  const [stake, setStake] = useState('Stake');
  const [amount, setAmount] = useState(0);
  const [totalStake, setTotalStake] = useState('');
  const [shareTreasury, setTreasuryShare] = useState('');
  const [totalRewards, setTotalRewards] = useState('');
  const [share, setShare] = useState(0);
  const [rewards, setRewards] = useState(0);

  const { hooks, approval, setApproval } = useStore(state => ({
    hooks: state.hooks,
    approval: state.approval,
    setApproval: state.setApproval
  }), shallow);
  const { useIsActive } = hooks;
  const active = useIsActive();

  useEffect( () => {
    if (account && active) {
      refreshStats();
    }
  }, [account, amount, stake]);

  const refreshStats = async () => {
    const { totalUserStake,
            treasuryShare,
            totalRewards } = await stakingStats();
    const { share, rewards } = await stakingEstimates(treasuryShare, totalUserStake, stake == 'Stake');
    setShare(share);
    setRewards(rewards);
    setTotalStake(totalUserStake.toFixed(2));
    setTreasuryShare((treasuryShare * 100).toPrecision(2));
    setTotalRewards(totalRewards);
  };

  const handleKeyPress = (event) => {
    if ((period && !/[0-9]/.test(event.key)) || !/[0-9\.]/.test(event.key)) {
      event.preventDefault();
    }
  };

  const handleChange = (event) => {
    setPeriod(/\./.test(event.target.value));
    setAmount(event.target.value);
    handleOnAmountSelect(event.target.value);
  };

  return (
    <div className="container select-bg d-flex justify-content-center">
      <Grid container justifyContent="center" spacing={6}>
        <Grid item md={4} xs={12}>
          <SmallBackground className="container">
            <SmallHeader className="text-center">Your stats</SmallHeader>
            <Stack spacing={1} className="stake-stats">
              <Stack sx={{ color: '#d8bfd8'}} className="align-center">
                <Box className="d-flex">
                  <h2>Total stake</h2>
                  <Tooltip
                    text={
                      "The total amount of ETRNL you are currently actively staking."
                    }
                  ></Tooltip>
                </Box>
                {totalStake == '' ? 
                  <CircularProgress color='inherit' size={15} />
                :
                  <p className="text-center" style={{ fontSize: "2vmin" }}>
                    {`${totalStake} ETRNL`}
                  </p>
                }
              </Stack>
              <Stack sx={{ color: '#d8bfd8'}} className="align-center">
                <Box className="d-flex">
                  <h2>Total Treasury Share</h2>
                  <Tooltip
                    text={
                      "The total percentage of all Eternal treasury revenue you earn."
                    }
                  ></Tooltip>
                </Box>
                {shareTreasury == '' ? 
                  <CircularProgress color='inherit' size={15} />
                :
                  <p className="text-center" style={{ fontSize: "2vmin" }}>
                    {`${shareTreasury}%`}
                  </p>
                }
              </Stack>
              <Stack sx={{ color: '#d8bfd8'}} className="align-center">
                <Box className="d-flex">
                  <h2>Total Rewards</h2>
                  <Tooltip
                    text={
                      "The total amount of staking rewards available for withdrawal."
                    }
                  ></Tooltip>
                </Box>
                {totalRewards == '' ? 
                  <CircularProgress color='inherit' style={{marginBottom: '7.5%'}} size={15} />
                :
                  <p className="text-center" style={{ fontSize: "2vmin" }}>
                    {`${totalRewards} ETRNL`}
                  </p>
                }
              </Stack>
            </Stack>
          </SmallBackground>
        </Grid>
        <Grid item md={6} xs={12}>
          <SelectBackground className="container">
            <FormControlLabel
              className="position-absolute"
              style={{ right: "1%", top: "1%" }}
              sx={{ width: "5%", height: "5%", minHeight: 2, minWidth: 2 }}
              control={
                <StakeSwitch
                  defaultChecked
                  onClick={() => {
                    setStake(stake === "Stake" ? "Unstake" : "Stake");
                  }}
                />
              }
              label={
                <Typography color={"#ffff"} fontWeight={450}>
                  {stake}
                </Typography>
              }
              labelPlacement="bottom"
            />
            {stake === "Stake" ? (
              <div className="d-flex align-items-center justify-content-center">
                <SelectHeader>Deposit ETRNL</SelectHeader>
                <Tooltip
                  text={
                    "Join forces with the Eternal Treasury by staking your ETRNL. You earn a percentage of all gaging fees!"
                  }
                ></Tooltip>
              </div>
            ) : (
              <div className="d-flex align-items-center justify-content-center">
                <SelectHeader>Withdraw ETRNL</SelectHeader>
                <Tooltip
                  text={
                    "Unstake your ETRNL and earn any accumulated rewards proportional to the amount you withdraw. See you later!"
                  }
                ></Tooltip>
              </div>
            )}
            <InputContainer className="input-container">
              <input
                type="text"
                inputMode="decimal"
                title="Token Amount"
                autoComplete="off"
                autoCorrect="off"
                pattern="^[0-9]*[.,]?[0-9]*$"
                placeholder="0.0"
                minLength="1"
                maxLength="18"
                spellCheck="false"
                onKeyPress={(event) => handleKeyPress(event)}
                onChange={(event) => handleChange(event)}
              ></input>
              <SelectToken>
                <TokenIcon src="img/etrnl.png"></TokenIcon>
                <TokenName>ETRNL</TokenName>
              </SelectToken>
            </InputContainer>
            <div className="gage-stats">
              <div className="d-flex align-items-center justify-content-around">
                <div>
                  {stake === "Stake" ? (
                    <>
                      <div className="d-flex align-center justify-content-center">
                        <h2>Added Share</h2>
                        <Tooltip
                          text={
                            "The additional share of the treasury's revenue you will receive from staking this amount."
                          }
                        ></Tooltip>
                      </div>
                      <p className="text-center">{share == 0 ? '' : `${share}%`}</p>
                    </>
                  ) : (
                    <>
                      <div className="d-flex align-center justify-content-center">
                        <h2>Deducted Share</h2>
                        <Tooltip
                          text={
                            "The share of the treasury's revenue you will give up from unstaking this amount of ETRNL."
                          }
                        ></Tooltip>
                      </div>
                      <p className="text-center">{share == 0 ? '' : `${share}%`}</p>
                    </>
                  )}
                </div>
                <div>
                  {stake === "Stake" ? (
                    <>
                      <div className="d-flex align-center justify-content-center">
                        <h2>Estimated Rewards</h2>
                        <Tooltip
                          text={
                            "The estimated amount of ETRNL that this added treasury share will earn you in one year."
                          }
                        ></Tooltip>
                      </div>
                      <p className="text-center">{rewards == 0 ? '' : `${rewards} ETRNL`}</p>
                    </>
                  ) : (
                    <>
                      <div className="d-flex align-center justify-content-center">
                        <h2>Rewards</h2>
                        <Tooltip
                          text={
                            "The rewards you will receive from unstaking this amount of ETRNL."
                          }
                        ></Tooltip>
                      </div>
                      <p className="text-center">{rewards + amount == 0 || (rewards == '0.0' && shareTreasury =='0.0') ? '' : `${rewards} ETRNL`}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          <Box className='col-sm-12 my-5 text-center'>
            {(amount <= 0) ?
              <ConfirmButton disabled={true} text={'Confirm'}></ConfirmButton>
            :
              ( (approval)  ?
                ( (stake == 'Stake') ? 
                  <ConfirmButton 
                    handleClick={async () => {
                      const result = await handleClickOnConfirmBtn(4);
                      return result;
                    }}
                    refresh={refreshStats} 
                    message={'Staking successful!'}
                    disabled={false} 
                    delay={true}
                    text={'Confirm'}></ConfirmButton>
                :
                  <ConfirmButton 
                    handleClick={async () => {
                      const result = await handleClickOnConfirmBtn(5);
                      return result;
                    }} 
                    refresh={refreshStats} 
                    message={'Sucessfully unstaked tokens!'}
                    disabled={false} 
                    delay={true}
                    text={'Confirm'}></ConfirmButton>
                )
              :
                <ConfirmButton 
                  handleClick={async () => {
                    let result;
                    try {
                      result = await handleClickOnApproveBtn('treasury');
                    }
                    catch {
                      return false;
                    }
                    return result;
                  }} 
                  success={() => setApproval(true)}
                  message={'Approval successful!'}
                  disabled={false} 
                  delay={true}
                  text={'Approve'}></ConfirmButton>
              )
            }
          </Box>
          </SelectBackground>
        </Grid>
      </Grid>
    </div>
  );
}

export default StakeUI;
